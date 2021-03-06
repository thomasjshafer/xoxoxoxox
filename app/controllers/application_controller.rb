# Filters added to this controller apply to all controllers in the application.
# Likewise, all the methods added will be available for all controllers.

class ApplicationController < ActionController::Base
  helper :all # include all helpers, all the time
  protect_from_forgery # See ActionController::RequestForgeryProtection for details

  filter_parameter_logging :password, :password_confirmation
  helper_method :current_user_session, :current_user

  private

  def setup_blank_user
    @user_session = UserSession.new
    @user = User.new
    @current_user = nil
  end
  
  def current_user_session
    return @current_user_session if defined?(@current_user_session)
    @current_user_session = UserSession.find
  end

  def current_user
    return @current_user if defined?(@current_user)
    @current_user = current_user_session && current_user_session.user
  end
  
  def find_last_ai
      @recent_ai = session[:recent_ai].present? ? current_user.ai_implementations.find(session[:recent_ai]) : current_user.ai_implementations.first
  end

  def require_user
    unless current_user
      store_location
      flash[:notice] = "You must be logged in to access this page"
      respond_to do |wants|
        wants.html {  }
        wants.js { render :json => {:success => false}}
      end
      return false
    end
  end
  # 
  # def require_no_user
  #   if current_user
  #     store_location
  #     flash[:notice] = "You must be logged out to access this page"
  #     redirect_to account_url
  #     return false
  #   end
  # end


end
